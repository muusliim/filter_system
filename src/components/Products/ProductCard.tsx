/* eslint-disable @next/next/no-img-element */
import { Product } from "@/db";

const ProductCard = ({ product }: { product: Product }) => {
	return (
		<div className="group relative">
			<div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
				<img
					src={product.imageId}
					alt={product.name}
					className="h-full w-full object-cover object-center"
				/>
			</div>
			<div className="mt-4 flex justify-between">
				<div>
					<h3 className="text-sm text-gray-700">{product.name}</h3>
					<p className="mt-1 text-sm font-medium text-gray-900">
						Size {product.size.toUpperCase()}, {product.color}
					</p>
				</div>
				<p className="text-sm font-medium text-gray-900">{product.price}$</p>
			</div>
		</div>
	);
};

export default ProductCard;
