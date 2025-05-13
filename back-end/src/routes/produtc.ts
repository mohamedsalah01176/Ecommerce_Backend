import Router from "express";
import ProductService from "../service/product";
import ProductControl from "../control/product";
import verifyToken from "../middleware/verifyToken";
// const {checkRole}=require("../middleware/auth")

let router = Router();

let productService = new ProductService();
let productControl = new ProductControl(productService);

router.get("/products", (req, res) => productControl.getAllProduct(req, res));
router.get("/product/:id", (req, res) =>
  productControl.getSpecificProduct(req, res)
);
router.post("/product", verifyToken, (req, res) =>
  productControl.addProduct(req, res)
);
router.patch("/product/:id", verifyToken, (req, res) =>
  productControl.updateProduct(req, res)
);
router.delete("/product/:id", verifyToken, (req, res) =>
  productControl.deleteProduct(req, res)
);
// Comments
router
  .route("/product/comment/:id")
  .post(verifyToken, productControl.addComment)
  .get(verifyToken, productControl.getAllComments);

router
  .route("/product/comment/:id/:commentId")
  .patch(verifyToken, productControl.updateComment)
  .delete(verifyToken, productControl.deleteComment);
export default router;
