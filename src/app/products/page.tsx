import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'

type Param = string | string[] | undefined

// Define the props for the ProductsPage component

interface ProductsPageProps {
	searchParams: { [key: string]: Param }
}

// Define a helper function to parse the search parameters

const parse = (param: Param) => {
	return typeof param === 'string' ? param : undefined
}

// Define the ProductsPage component

const ProductsPage = ({
	searchParams,
}: ProductsPageProps) => {

	// Parse the search parameters
	const sort = parse(searchParams.sort)
	const category = parse(searchParams.category)

	const label = PRODUCT_CATEGORIES.find(
		({ value }) => value === category
	)?.label

	// Render the ProductsPage component

	return (
		<MaxWidthWrapper>
			<ProductReel
				title={label ?? 'Browse high-quality assets'}
				query={{
					category,
					limit: 40,
					sort:
						sort === 'desc' || sort === 'asc'
							? sort
							: undefined,
				}}
			/>
		</MaxWidthWrapper>
	)
}

export default ProductsPage