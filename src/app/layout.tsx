import type{Metadata}from"next";import"./globals.css";
export const metadata:Metadata={title:"AutoCredit",description:"Compra Inteligente vehicular en soles"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
