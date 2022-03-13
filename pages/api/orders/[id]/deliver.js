import nc from "next-connect";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";
import { isAuth } from "../../../../utils/auth";
import { onError } from "../../../../utils/errors";
const handler = nc(onError);
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.body.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({ message: "Order delivered", order: deliveredOrder });
  } else {
    await db.disconnect();
    res.status(401).send({ message: "Order not found" });
  }
});

export default handler;
