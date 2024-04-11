
const Sceleton = () => {
  return (
    <div className="relative animate-pulse">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
            <div className="h-full w-full bg-gray-200"/>
        </div>
        <div className="mt-4 flex flex-col gap-2">
            <div className="h-4 w-3/4 bg-gray-200"/>
            <div className="h-4 w-1/2 bg-gray-200"/>
        </div>
    </div>
  )
}

export default Sceleton