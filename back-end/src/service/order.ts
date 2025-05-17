import jwt from "jsonwebtoken";
import { IOrder } from "../interface/order";
import CustomerModel from "../model/customer";
import OrderModel from "../model/order";
import ProductModel from "../model/product";
import UserModel from "../model/user";

export default class OrderService {
  constructor() {}

  async handleCreateOrder(body: IOrder[], token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string; userName: string };
    console.log(decodedToken);
    if (decodedToken.role == "user") {
      let adminsId: string[] = [];
      let total: number = 0;
      let products: {}[] = [];
      let order_details!: {};
      try {
        for (let j = 0; j < body.length; j++) {
          for (let i = 0; i < body[j].products.length; i++) {
            await ProductModel.updateOne(
              { _id: body[j].products[i]._id },
              { $inc: { sold: 1 } }
            );
            const adminId = body[j].products[i].adminId;
            if (typeof adminId === "string" && !adminsId.includes(adminId)) {
              adminsId.push(adminId);
            }
            total +=
              body[j].products[i].price * Number(body[j].products[i].quantity);
            products.push(body[j].products[i]);
          }
          order_details = body[j].order_details;
        }
        let body2 = {
          order_details,
          userId: decodedToken.userID,
          userName: decodedToken.userName,
          products,
        };
        console.log(body2);
        const newOrder = new OrderModel({ ...body2, adminsId, total });
        await newOrder.save();
        return {
          status: "success",
          message: "Order Created",
        };
      } catch (errors) {
        console.log(errors);
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handlegetOrdersForUser(userId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    console.log(userId);
    if (decodedToken.role == "user") {
      try {
        console.log(userId);
        let orders = await OrderModel.find({ userId: userId });
        return {
          status: "success",
          orders,
        };
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handledeleteSpecificOrder(orderId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "user") {
      try {
        console.log(decodedToken.userID);
        const order = await OrderModel.deleteOne({ _id: orderId });
        const remainingOrders = await OrderModel.find({
          userId: decodedToken.userID,
        });

        if (order.deletedCount > 0) {
          return {
            status: "success",
            message: "order deleted",
            remainingOrders,
          };
        } else {
          return {
            status: "fail",
            message: "order not found",
          };
        }
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handleDeletetAllOrder(userId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "user") {
      try {
        console.log(userId);
        const order = await OrderModel.deleteMany({ userId: userId });
        console.log(order);
        if (order.deletedCount > 0) {
          return {
            status: "success",
            message: "order deleted",
          };
        } else {
          return {
            status: "fail",
            message: "order not found",
          };
        }
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handleComplateOrder(orderId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "admin") {
      try {
        const order = await OrderModel.findOneAndDelete({ _id: orderId });
        if (order?.id) {
          const custometFound = await CustomerModel.findOne({
            userId: order.userId,
          });
          const userDetails = await UserModel.findOne({ _id: order.userId });
          console.log(userDetails, "llllll");
          console.log(order.adminsId, "bbbb");
          if (custometFound?._id) {
            await CustomerModel.updateOne(
              { userId: order.userId },
              { $push: { orders: order } }
            );
          } else {
            const newCustomer = new CustomerModel({
              orders: order,
              adminsId: order.adminsId,
              userDetails,
            });
            await newCustomer.save();
          }
          return {
            status: "success",
            message: "order Complated",
          };
        } else {
          return {
            status: "fail",
            message: "order not found",
          };
        }
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
  async handleGetOrderForAdmin(adminId: string, token: string) {
    let decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as { role: string; userID: string };
    if (decodedToken.role == "admin") {
      try {
        console.log(adminId);
        let orders = await OrderModel.find({ adminsId: adminId });
        return {
          status: "success",
          orders,
        };
      } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
    } else {
      return {
        status: "Error",
        message: "You are not authorized to access this resource!",
      };
    }
  }
}
