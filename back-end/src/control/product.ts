import e, { Request, Response } from "express";
import ProductService from "../service/product";
import { IProduct } from "../interface/product";

export default class ProductControl {
  constructor(private productService: ProductService) {}

  async getAllProduct(req: Request, res: Response) {
    let resSer = await this.productService.handleGetAllProducts();
    if (resSer.status === "fail") {
      res.status(500).json(resSer);
    } else {
      res.status(200).json(resSer);
    }
  }
  async getSpecificProduct(req: Request, res: Response) {
    let id = req.params.id;
    let resSer = await this.productService.handleGetSpecificProduct(id);
    if (resSer.status === "fail") {
      res.status(404).json(resSer);
    } else if (resSer.status == "error") {
      res.status(500).json(resSer);
    } else {
      res.status(200).json(resSer);
    }
  }
  async addProduct(req: Request, res: Response) {
    let body = req.body;
    let token = req.headers["authorization"] as string;
    let resSer = await this.productService.handleAddProduct(body, token);
    if (resSer.status == "error") {
      res.status(500).send(resSer);
    } else {
      res.status(200).send(resSer);
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    let id = req.params.id;
    const product = await this.productService.handleGetSpecificProduct(id);
    const productList = product.product as IProduct[];

    if (!productList || productList.length === 0) {
      res.status(404).send({
        status: "Error",
        message: "Product not found",
      });
      return;
    }

    if (productList[0]?.adminId?.toString() !== req.user.userID) {
      res.status(401).send({
        status: "Error",
        message: "You are not authorized to delete this product",
      });
      return;
    }

    const deleteRes = await this.productService.handleDeleteProduct(id);

    if (deleteRes.status == "error") {
      res.status(500).send(deleteRes);
    } else {
      res.status(200).send(deleteRes);
    }
  }

  async updateProduct(req: Request, res: Response) {
    // let body = req.body;
    // let id = req.params.id;
    // let resSer = await this.productService.handleUpdateProduct(body, id);
    // if (resSer.status == "error") {
    //   res.status(500).send(resSer);
    // } else {
    //   res.status(200).send(resSer);
    // }

    let id = req.params.id;
    const product = await this.productService.handleGetSpecificProduct(id);
    const productList = product.product as IProduct[];

    if (!productList || productList.length === 0) {
      res.status(404).send({
        status: "Error",
        message: "Product not found",
      });
      return;
    }

    if (productList[0]?.adminId?.toString() !== req.user.userID) {
      res.status(401).send({
        status: "Error",
        message: "You are not authorized to delete this product",
      });
      return;
    }

    const body = req.body;
    const updateRes = await this.productService.handleUpdateProduct(body, id);

    if (updateRes.status == "error") {
      res.status(500).send(updateRes);
    } else if (updateRes.status == "fail") {
      res.status(404).send(updateRes);
    } else {
      res.status(200).send(updateRes);
    }
  }
}
