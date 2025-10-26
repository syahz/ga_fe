import Image from 'next/image'

export default function Home() {
  return (
    <div
      className="relative font-[family-name:var(--font-geist-sans)] min-h-screen text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/img/BMU Background.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#079C4A]/80 to-[#003161]/80  backdrop-blur-xs"></div>

      <div className="relative z-10 flex flex-col justify-between w-full min-h-screen max-w-7xl mx-auto p-8">
        {/* Logo in the top-left corner */}
        <div className="flex justify-start items-start h-full w-full">
          <Image src="/img/SidebarLogosWhite.svg" className="animate-[spin_3s_linear_infinite]" alt="BMU Logos" width={80} height={80} />
        </div>

        {/* Text in the bottom-right corner */}
        <div className="flex justify-end items-end h-full w-full">
          <p className="text-right  max-w-sm text-3xl font-medium">Grow And Prosper Together with Us!</p>
        </div>
      </div>
    </div>
  )
}
