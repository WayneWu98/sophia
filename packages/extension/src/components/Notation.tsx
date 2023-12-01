import classNames from 'classnames'

interface Props {
  position?: [number, number]
}

const Notation = ({ position }: Props) => {
  return (
    <div
      className={classNames('fixed z-9999 transform -translate-x-1/2', { hidden: !position })}
      style={{ top: position?.[1] ?? 0, left: position?.[0] ?? 0 }}
    >
      <h1 className="text-black">hello</h1>
    </div>
  )
}

export default Notation
