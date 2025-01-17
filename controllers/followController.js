require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models');
// const { followers } = require('../models');
const followers = db.followers;
const User = db.users
const Profile = db.profile

const follow = async (req,res) => {
    // GET USER TO FOLLOW BY USERNAME
    const { username } = req.params
    const user = await User.findOne({
        where: { username: username }
    })
    if(!user) throw new appError('No user with that username', 404)
    // GET USERID FROM THE USER
    const followeeId = user.id   //'the person being followed
    const userId = req.user.id   //'the person doing the follow'
    
    // PREVENT FOLLOWING OWN SELF
    if(followeeId == userId) throw new appError('Can"t follow yourself', 400)
    // CHECK IF USER ALREADY FOLLOWS FOLLOWEE
    const existingFollow = await followers.findOne({
        where: {
            followeeId: followeeId,
            userId: userId,
        }
    })

    // IF ALREADY FOLLOWS
    if(existingFollow){
        return res.status(400).json({ message: 'You already follow this user'})
    }
    
    // IF NOT, CREATE FOLLOW
    if(!existingFollow){
        const follow = await followers.create({
            followeeId: followeeId,
            userId: userId,
        })

        return res.status(200).json({ 
            status: 'success',
            message: 'User followed'
        })
    }

}  

const unfollow = async (req,res) => {
    // GET USER TO FOLLOW BY USERNAME
    const { username } = req.params
    const user = await User.findOne({
        where: { username: username }
    })
    if(!user) throw new appError('No user with that username', 404)
    // GET USERID FROM THE USER
    const followeeId = user.id   //'the person being followed
    const userId = req.user.id   //'the person doing the follow'
    console.log(followeeId,userId)
    
    // CHECK IF USER FOLLOWS FOLLOWEE
    const existingFollow = await followers.findOne({
        where: {
            followeeId: followeeId,
            userId: userId,
        }
    })
    // IF ALREADY FOLLOWS
    if(existingFollow){
        const unfollow = await existingFollow.destroy()
    }
    
    return res.status(200).json({ 
        status: 'success',
        message: 'Unfollowed user' 
    })
    
}


const getUserFollowers = async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({
        where: { username : username }
    })

    const userFollowers= await followers.findAll({
        where: { followeeId: user.id },
        include: [{ 
            model: User, 
            attributes: { exclude: ['password', 'email', 'googleId', 'githubId', 'passwordToken', 'passwordResetExpires', 'deletionDate', 'updatedAt'] } 
        }] 
    });

    res.status(200).json({
        status: 'success',
        results: userFollowers.length,
        data: userFollowers
    })
}


// const getUserFollowings = async (req, res) => {
//     const { username } = req.params
//     const user = await User.findOne({
//         where: { username : username }
//     })

//     const userFollows = await followers.findAll({
//         where: { userId: user.id },
//         include: [{ 
//             model: User,
//             attributes: { exclude: ['password', 'email', 'googleId', 'githubId', 'passwordToken', 'passwordResetExpires', 'deletionDate', 'updatedAt'] }
//           }] 
//     });

//     res.status(200).json({
//         status: 'success',
//         results: userFollows.length,
//         data: userFollows
//     })
// }

module.exports = {
    follow,
    unfollow,
    getUserFollowers,
    // getUserFollowings
}