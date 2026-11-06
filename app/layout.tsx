import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Çetin Parke | Mekânlara Değer Katıyoruz",description:"Sakarya Pamukova'da parke, iç kapı, banyo dolabı ve duşakabin çözümleri. Çetin Parke."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>}
