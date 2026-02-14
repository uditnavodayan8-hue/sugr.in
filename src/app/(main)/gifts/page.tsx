"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

export default function GiftsPage() {
    const router = useRouter();

    return (
        <div className="h-screen w-full bg-[#232010] flex flex-col">
            <header className="px-6 py-4 flex items-center gap-4 text-white">
                <button onClick={() => router.back()}><Icon name="arrow_back" /></button>
                <h2 className="text-lg font-bold flex-1 text-center pr-6">Gifts</h2>
            </header>
            <div className="px-6 pt-2 pb-4"><h2 className="text-white text-[22px] font-bold">Premium Gifts</h2></div>
            <main className="flex-1 overflow-y-auto px-4 space-y-4 pb-12">
                {[
                    { name: "Sabyasachi Accessories", cost: 100, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMhiiwhRRdqU_aF-HQo5zvO6RzQQy9eVPRdl2meniXMjNn081wBpILC9_0R32QqhbOyLOANIECzyO-I9TjTWtQBusFRzoQqNmaVPAscX_uIcUoY20lKFSPRztXkusQZ6oVFn8RX-s-0h93keX30uHr5yYBsTvg2nJHZA5haiDhuQ_nv9PFCqNefZCgYDsX7QNLHPXWI56d-JHdlg-Pym6Vh74YnTdCY8OYDIxd4PpZCncC7vNWHBOFDRa-GJ5M3CAx1J6SfFJlOVg" },
                    { name: "Premium Taj Staycation", cost: 250, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBERbzl4cgBVwBpSzaSZa5mMOpdM7WcuPAp1pJfguEQ2mtOJPeFI5xGSEBTu036wUs7pr-eA_Tq81G6KPrqzc5DJ3HO0-bV1AaHARg1Cfcy0IamAgnlEVf1y1M0C8_RhC6Qv3Vp86FmZmVI5yEOCXCCfT8VI60M4GFs_SNbVbloydmGqXCMhLQsoJw0tupfUSvDRG45bGQ1UCRANa1WX0KSqpNu2itVUclws3f3vZse5NDRlG8bfneiFduGNoR-G6ra2pj5L3Pj7GY" },
                    { name: "Artisanal Hampers", cost: 50, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQlXgxnB798EuIIgzSvict0CtCLNQWvTVjTUzePARHuPlhm6VYhJCCAhEFA1-Dx78JnbEf52dHsKGyIaGLrkUSik25yrbIp2dw7T3x6qj49SSxaE6xbaXNIdwL7A0w9n8mYv7SwwqU0OJh9cWg-88XMIm4dggdjntVSj4ij3qqE7Y_YPOL1GLI5Bu4uu99ix-LKZ974FDLADlllV-nm391qBDkcIYP-ONiCoodG1rWSk-FIApahGEAiIitkVpnKDmIWSzMaYkDxmo" },
                ].map((gift, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-[#342f18] rounded-xl border border-white/5">
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            <p className="text-[#cbc190] text-sm">{gift.name}</p>
                            <p className="text-white font-bold">{gift.name}</p>
                            <p className="text-[#cbc190] text-sm">Gold Credit: {gift.cost}</p>
                            <button className="mt-2 bg-[#494222] text-white px-4 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2">Send Anonymously <Icon name="toggle_on" /></button>
                        </div>
                        <img src={gift.img} className="w-24 h-24 rounded-lg object-cover bg-gray-800" alt={gift.name} />
                    </div>
                ))}
            </main>
        </div>
    )
}
