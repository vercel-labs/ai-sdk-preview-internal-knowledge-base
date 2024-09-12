export interface Order {
  id: string;
  name: string;
  orderedAt: string;
  image: string;
}

export const ORDERS: Order[] = [
  {
    id: "539182",
    name: "Apple TV",
    orderedAt: "2024-08-25",
    image: "tv.png",
  },
  {
    id: "281958",
    name: "Apple iPhone 14 Pro",
    orderedAt: "2024-08-24",
    image: "iphone.png",
  },
  {
    id: "281958",
    name: "Apple Watch Ultra 2",
    orderedAt: "2024-08-26",
    image: "watch.png",
  },
];

export interface TrackingInformation {
  orderId: string;
  progress: "Shipped" | "Out for Delivery" | "Delivered";
  description: string;
}

export const TRACKING_INFORMATION = [
  {
    orderId: "412093",
    progress: "Shipped",
    description: "Last Updated Today 4:30 PM",
  },
  {
    orderId: "281958",
    progress: "Out for Delivery",
    description: "ETA Today 5:45 PM",
  },
  {
    orderId: "539182",
    progress: "Delivered",
    description: "Delivered Today 3:00 PM",
  },
];

export const getOrders = () => {
  return ORDERS;
};

export const getTrackingInformation = ({ orderId }: { orderId: string }) => {
  return TRACKING_INFORMATION.find((info) => info.orderId === orderId);
};
