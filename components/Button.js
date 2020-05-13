export default React.forwardRef(({ onClick, href, name }, ref) => {
  return (
    <a
      className="inline-block m-4 uppercase px-5 py-3 rounded-lg shadow-sm bg-indigo-500 text-white tracking-wider font-semibold"
      href={href}
      onClick={onClick}
      ref={ref}
    >
      {name}
    </a>
  )
})
