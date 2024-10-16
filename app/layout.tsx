import type { Metadata } from "next";
import './globals.scss';

export const metadata: Metadata = {
	title: "Recipes Catalog",
	description: "Simple app for your favorite recipes",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
			{children}
			</body>
		</html>
	);
}
