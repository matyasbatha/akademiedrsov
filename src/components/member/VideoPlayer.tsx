"use client";

interface VideoPlayerProps {
  url: string;
  title?: string;
}

function getEmbedUrl(url: string): { type: "vimeo" | "youtube" | "direct"; src: string } {
  if (url.includes("vimeo.com")) {
    const idMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const id = idMatch?.[1];
    const hashMatch = url.match(/vimeo\.com\/\d+\/([a-f0-9]+)/) || url.match(/[?&]h=([a-f0-9]+)/);
    const hash = hashMatch?.[1];
    const hashParam = hash ? `&h=${hash}` : "";
    return { type: "vimeo", src: `https://player.vimeo.com/video/${id}?color=c9a84c&title=0&byline=0&portrait=0${hashParam}` };
  }
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    const id = match?.[1];
    return { type: "youtube", src: `https://www.youtube.com/embed/${id}` };
  }
  return { type: "direct", src: url };
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const { type, src } = getEmbedUrl(url);

  if (type === "direct") {
    return (
      <div className="aspect-[9/16] bg-black w-full">
        <video
          src={src}
          controls
          className="w-full h-full object-contain"
          title={title}
          playsInline
        />
      </div>
    );
  }

  return (
    <div className="aspect-[9/16] bg-black w-full">
      <iframe
        src={src}
        title={title}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
