/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "localhost",
				pathname: "**",
				port: "3000",
				protocol: "http",
			},
			{
				hostname: "digital-marketplace-fox.vercel.app",
				pathname: "**",
				protocol: "https",
			}
		]
	}
};

export default nextConfig;