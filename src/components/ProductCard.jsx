import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { products } from "@/data/product.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const ProductCard = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {products.map((p) => (
        <div key={p.product_id}>
          <Card className="border-0 shadow-none w-full max-w-sm p-2">
            <CardHeader className="p-0">
              <div className="bg-brand-mediumgray w-[250px] h-[250px] rounded-xl" />
              <CardTitle>{p.product_title}</CardTitle>
              <CardTitle>{p.sell_price.toLocaleString()}원</CardTitle>
              <CardDescription>{dayjs(p.created_at).fromNow()}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
