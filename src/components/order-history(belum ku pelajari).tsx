import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/lib/db/models/order.model";

const MyOrderHistory = () => {
  const { data: session, status } = useSession();

  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = session?.user;

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (user?.id) {
        setIsLoading(true);
        const data = await Order.find({ buyer_id: user.id }).populate({
          path: "items",
          populate: { path: "product_id" },
        });
        setOrderHistory(data);
        setIsLoading(false);
      }
    };
    fetchOrderHistory();
  }, [user]);

  if (status === "loading" || isLoading) return <div>Loading ...</div>;

  return (
    <div>
      <h2>My Order History</h2>
      {orderHistory?.map((order) => (
        <div
          key={order._id}
          style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
        >
          <h3>Order ID: {order._id}</h3>
          {order.items?.map((orderItem: any) => (
            <div
              key={orderItem._id}
              style={{
                border: "1px solid #ddd",
                padding: "5px",
                margin: "5px",
              }}
            >
              <p>Product: {orderItem.product_id.name}</p>
              <p>Qty : {orderItem.qty}</p>
            </div>
          ))}
          <p>Total Amount: {order.total_amount}</p>
          <p>Payment Status : {order.payment_status}</p>
          <p>Shipping Status : {order.shipping_status}</p>
          <p>Order Date : {order.order_date}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrderHistory;
