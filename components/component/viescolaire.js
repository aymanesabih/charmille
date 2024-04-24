export function VieScolaire() {
    return (
      <div className="w-full">
        <div className="">
          <div className="relative w-full h-64">
            <img
              src={"/banner.jpeg"}
              alt={"Vie Scolaire"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white text-6xl font-bold">{"Vie Scolaire"}</div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="flex  items-center lg:ml-20 my-5 ml-2 md:ml-10 md:my-10 sm:ml-1">
              <img
                alt="Image"
                src="/theater.png"
                className="w-[5rem] lg:w-[10rem] h-auto"
              />
              <div className="mx-auto">
                <h1 className=" text-red-900 text-center lg:text-10xl md:text-7xl sm:text-5xl text-4xl">
                  Theater
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start">
              <iframe
                className="aspect-video w-full max-h-[400px]"
                src="https://www.youtube.com/embed/VkBnNxneA_A?si=fKRa7GmxZ29Vmw8K" 
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
  
          <div className="grid lg:grid-cols-2">
            <div className="grid grid-cols-1 items-start">
              <iframe
                className="aspect-video w-full max-h-[400px]"
                src="https://www.youtube.com/embed/VkBnNxneA_A?si=fKRa7GmxZ29Vmw8K" 
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
            <div className="flex  items-center lg:ml-20 my-5 ml-2 md:ml-10 md:my-10 sm:ml-1">
              <img
                alt="Image"
                src="/music1.png"
                className="w-[5rem] lg:w-[10rem] h-auto" 
              />
              <div className="mx-auto">
                <h1 className=" text-[#fdb341] text-center lg:text-10xl md:text-7xl sm:text-5xl text-4xl">
                  Music Education
                </h1>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="flex  items-center lg:ml-20 my-5 ml-2 md:ml-10 md:my-10 sm:ml-1">
              <img
                alt="Image"
                src="/art.png"
                className="w-[5rem] lg:w-[10rem] h-auto"
              />
              <div className="mx-auto">
                <h1 className=" text-[#3f743b] text-center lg:text-10xl md:text-7xl sm:text-5xl text-4xl">
                  Art Education
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start">
              <iframe
                className="aspect-video w-full max-h-[400px]"
                src="https://www.youtube.com/embed/VkBnNxneA_A?si=fKRa7GmxZ29Vmw8K" 
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="grid grid-cols-1 items-start">
              <iframe
                className="aspect-video w-full max-h-[400px]"
                src="https://www.youtube.com/embed/VkBnNxneA_A?si=fKRa7GmxZ29Vmw8K"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
            <div className="flex  items-center lg:ml-20 my-5 ml-2 md:ml-10 md:my-10 sm:ml-1">
              <img
                alt="Image"
                src="/dumbbell.png"
                className="w-[5rem] lg:w-[10rem] h-auto" 
              />
              <div className="mx-auto">
                <h1 className=" text-[#1689FC] text-center lg:text-10xl md:text-7xl sm:text-5xl text-4xl">
                  Physical Education
                </h1>
              </div>
            </div>
          </div>
        </div>
  
      </div>
  
    );
  }
  