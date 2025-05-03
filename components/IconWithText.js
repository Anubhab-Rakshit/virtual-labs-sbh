import Image from 'next/image';

export default function IconWithText({ src = "/chemistry.png", alt = "Chemistry Icon", text = "" }) {
  return (
    <div className="flex items-center gap-2">
      <Image src={src} alt={alt} width={50} height={50} />
      <span className="text-base">{text}</span>
    </div>
  );
}
