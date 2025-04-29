import Image from "next/image";
export const Hero = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl text-white">
        <span className="title-gradient">solsec</span> dashboard
      </h1>
      <p className="text-lg leading-none text-gray-300">
        Simply the best comprehensive open-source tracker for <br />
        <span className="flex items-center justify-center">
          <Image src="solanaLogo.svg" alt="solana" width={80} height={80} />
          &nbsp; ecosystem security exploits
        </span>
      </p>
    </div>
  );
};
