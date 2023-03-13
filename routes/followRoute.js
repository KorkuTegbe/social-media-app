const router = require('express').Router()
const followController = require('../controllers/followController')
const authenticate = require('../middleware/authentication')
const { accessControl, authorizeAccessToPrivateAccount } = require('../middleware/accessControl')


router.post('/follow/:username', authenticate, authorizeAccessToPrivateAccount, accessControl, followController.follow);
router.delete('/unfollow/:username', authenticate, followController.unfollow);
router.get('/followers/:username', followController.getUserFollowers)
// router.get('/followings/:username', followController.getUserFollowings)


module.exports = router