import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductCard = () => {
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>상품명</CardTitle>
          <CardTitle>가격</CardTitle>
          <CardDescription>시간</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProductCard;
