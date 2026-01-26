import Image from "next/image";

const SplashScreen = () => {
  return (
    <div className="relative w-dvh h-dvh">
      <Image
        src="/splash.png"
        alt="Splash Screen"
        fill
        sizes="100vw"
        className="object-cover/"
      />
    </div>
  );
};

export default SplashScreen;
