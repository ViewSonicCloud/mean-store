var express = require("express");
var router = express.Router();
var controller = require(ROOT_FOLDER + "/controllers/api/v1/user/cart");
var auth = require(ROOT_FOLDER + "/middlewares/authentication");
router.get("/get-product",auth.partialAuthenticate, controller.getCart);
router.get("/get-product-mobile",auth.partialAuthenticate, controller.getCartMobile);
router.post("/type/buy",auth.partialAuthenticate, controller.getDetailForBuyNow);
router.get("/type/cart",auth.partialAuthenticate, controller.getCart);
router.delete("/remove-product",auth.partialAuthenticate, controller.removeProductFromCart);
router.post("/add-product", auth.partialAuthenticate, controller.addProductToCart);
router.post("/update-product", auth.partialAuthenticate, controller.updateProductToCart);
router.get("/count", auth.partialAuthenticate, controller.getCount);
router.post("/increment/:qty", auth.partialAuthenticate, controller.incrementQuantity);
router.post("/decrement/:qty", auth.partialAuthenticate, controller.decrementQuantity);
module.exports = router;
