"use client";

import ProductCard from "@/components/Products/ProductCard";
import Sceleton from "@/components/Products/Sceleton";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/db";
import { cn } from "@/lib/utils";
import { ProductState } from "@/lib/validators/product-validator";
import { AccordionContent } from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { QueryResult } from "@upstash/vector";
import axios from "axios";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
	{ name: "Все", value: "none" },
	{ name: "Сначала дешевле", value: "price-asc" },
	{ name: "Сначала дороже", value: "price-desc" },
] as const;

const COLOR_FILTERS = {
	id: "color",
	name: "Color",
	options: [
		{ value: "white", label: "Белый" },
		{ value: "beige", label: "Бежевый" },
		{ value: "blue", label: "Синий" },
		{ value: "green", label: "Зеленый" },
		{ value: "purple", label: "Фиолетовый" },
	],
} as const;
const SIZE_FILTERS = {
	id: "size",
	name: "Size",
	options: [
		{ value: "S", label: "S" },
		{ value: "M", label: "M" },
		{ value: "L", label: "L" },
	],
} as const;

const PRICE_FILTERS = {
	id: "price",
	name: "Price",
	options: [
		{
			value: [0, 100],
			label: "Любая цена",
		},
		{
			value: [0, 20],
			label: "до 20$",
		},
		{
			value: [0, 40],
			label: "до 40$",
		},
		//custom option
	],
};

const SUBCATEGORY_OPTIONS = [
	{ name: "Футболки", selected: true, href: "#" },
	{ name: "Худи", selected: false, href: "#" },
	{ name: "Рубашки", selected: false, href: "#" },
	{ name: "Акссесуары", selected: false, href: "#" },
] as const;

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

export default function Home() {
	const [filter, setFilter] = useState<ProductState>({
		sort: "none",
		size: ["L", "M", "S"],
		color: ["beige", "blue", "green", "purple", "white"],
		price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
	});

	const { data: products } = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const { data } = await axios.post<QueryResult<Product>[]>(
				"http://localhost:3000/api/products",
				{
					filter: {
						sort: filter.sort,
					},
				}
			);

			return data;
		},
	});

	const applyArrayFilter = ({
		category,
		value,
	}: {
		category: keyof Omit<typeof filter, "price" | "sort">;
		value: string;
	}) => {
		const isFilterApplied = filter[category].includes(value as never);

		if (isFilterApplied) {
			setFilter((prev) => ({
				...prev,
				[category]: prev[category].filter((v) => v !== value),
			}));
		} else {
			setFilter((prev) => ({
				...prev,
				[category]: [...prev[category], value],
			}));
		}
		console.log(filter);
	};

	return (
		<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24 ">
				<h1 className="text-4xl font-bold tracking-tighter text-gray-900">
					Новая коллекция
				</h1>

				<div className="flex items-center">
					<DropdownMenu>
						<DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium to-gray-700">
							Сортировать
							<ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{SORT_OPTIONS.map((option) => (
								<button
									className={cn("text-left w-full block px-4 py-2 text-sm", {
										"text-gray-900 bg-gray-200 font-medium":
											option.value === filter.sort,
										"text-gray-500": option.value !== filter.sort,
									})}
									key={option.name}
									onClick={() => setFilter({ ...filter, sort: option.value })}
								>
									{option.name}
								</button>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden ">
						<Filter className="h-5 w-5" />
					</button>
				</div>
			</div>

			<section className="pb-24 pt-16">
				<div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
					<div className="hidden lg:block">
						<ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
							{SUBCATEGORY_OPTIONS.map((ctgr) => (
								<li key={ctgr.name}>
									<button
										disabled={!ctgr.selected}
										key={ctgr.name}
										className="disabled:cursor-not-allowed disabled:opacity-60"
									>
										{ctgr.name}
									</button>
								</li>
							))}
						</ul>
						<Accordion type="multiple" className="animate-none">
							{/*COlor filter*/}
							<AccordionItem value="color">
								<AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-600">
									<span className="font-medium text-gray-900">Цвет</span>
								</AccordionTrigger>
								<AccordionContent className="AccordionContent">
									<ul>
										{COLOR_FILTERS.options.map((option, optionIdx) => (
											<li
												key={option.value}
												className="flex items-center py-1 "
											>
												<input
													type="checkbox"
													id={`color-${optionIdx}`}
													className="h-4 w-4 border-gray-300 text-cyan-500 focus:ring-cyan-500 "
													onChange={() => {
														applyArrayFilter({
															category: "color",
															value: option.value,
														});
													}}
													checked={filter.color.includes(option.value)}
												/>
												<label
													htmlFor={`color-${optionIdx}`}
													className="ml-3 text-sm text-gray-600 "
												>
													{option.label}
												</label>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>
							{/*size filter*/}
							<AccordionItem value="size">
								<AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-600">
									<span className="font-medium text-gray-900">Размер</span>
								</AccordionTrigger>
								<AccordionContent className="AccordionContent">
									<ul>
										{SIZE_FILTERS.options.map((option, optionIdx) => (
											<li
												key={option.value}
												className="flex items-center py-1 "
											>
												<input
													type="checkbox"
													id={`size-${optionIdx}`}
													className="h-4 w-4 border-gray-300 text-cyan-500 focus:ring-cyan-500 "
													onChange={() => {
														applyArrayFilter({
															category: "size",
															value: option.value,
														});
													}}
													checked={filter.size.includes(option.value)}
												/>
												<label
													htmlFor={`size-${optionIdx}`}
													className="ml-3 text-sm text-gray-600 "
												>
													{option.label}
												</label>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>
							{/* price filter */}
							<AccordionItem value="price">
								<AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-600">
									<span className="font-medium text-gray-900">Цена</span>
								</AccordionTrigger>
								<AccordionContent className="AccordionContent">
									<ul>
										{PRICE_FILTERS.options.map((option, optionIdx) => (
											<li
												key={option.label}
												className="flex items-center py-1 "
											>
												<input
													type="radio"
													id={`price-${optionIdx}`}
													className="h-4 w-4 border-gray-300 text-cyan-500 focus:ring-cyan-500 "
													onChange={() => {
														setFilter((prev) => ({
															...prev,
															price: {
																isCustom: false,
																range: [option.value[0], option.value[1]],
															},
														}));
													}}
													checked={
														!filter.price.isCustom &&
														filter.price.range[0] === option.value[0] &&
														filter.price.range[1] === option.value[1]
													}
												/>
												<label
													htmlFor={`price-${optionIdx}`}
													className="ml-3 text-sm text-gray-600 "
												>
													{option.label}
												</label>
											</li>
										))}
										<li className="flex justify-center flex-col gap-2">
											<div>
												<input
													type="radio"
													id={`price-${PRICE_FILTERS.options.length}`}
													className="h-4 w-4 border-gray-300 text-cyan-500 focus:ring-cyan-500 "
													onChange={() => {
														setFilter((prev) => ({
															...prev,
															price: {
																isCustom: true,
																range: [0, 100],
															},
														}));
													}}
													checked={
														filter.price.isCustom
													}
												/>
												<label
													htmlFor={`price-${PRICE_FILTERS.options.length}`}
													className="ml-3 text-sm text-gray-600 "
												>
													Установить цену
												</label>
											</div>
										</li>
									</ul>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>

					<ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
						{products
							? products?.map((product) => (
									<li key={product?.id}>
										<ProductCard product={product.metadata!} />
									</li>
							  ))
							: [...Array(12)].map((_, i) => (
									<li key={i}>
										<Sceleton />
									</li>
							  ))}
					</ul>
				</div>
			</section>
		</main>
	);
}
