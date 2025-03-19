import { Router } from "express";
import * as rh from './requesthandler.js' 
import Auth from './authentication/auth.js'

const router=Router()

router.route('/adduser').post(rh.addUser)
router.route('/login').post(rh.login)
router.route('/verifyEmail').post(rh.verifyEmail)
router.route('/verifyRegister').post(rh.verifyRegister)
router.route('/profile').get(Auth,rh.getUserData)
router.route('/updatePassword').put(rh.updatePassword)
router.route('/updateUser').put(Auth,rh.updateUserData)
router.route('/addbook').post(Auth,rh.addBook)
router.route('/getallbooks').get(rh.getAllBookss);
router.route('/getbook/:bookId').get(Auth, rh.getBookById);
router.route("/book").post(Auth, rh.bookBook);
router.route('/book/:bookId/reserve').post(Auth, rh.reserveBook);


// router.route("/booking/history").get(Auth, rh.getBookingHistory);
// router.route("/orders").get(Auth, rh.getOrder);
// router.route('/orders/:orderId/confirm').put(Auth, rh.confirmOrder);
// router.route('/book/:bookId/return').put(Auth, rh.returnBook);  // Returns a book
// router.route('/orders/:orderId/return').put(Auth, rh.returnOrder);  // Returns an order



export default router