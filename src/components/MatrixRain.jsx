import { useRef } from 'react'
import useMatrixRain from '../hooks/useMatrixRain'

export default function MatrixRain() {
  const canvasRef = useRef(null)
  useMatrixRain(canvasRef)
  return <canvas ref={canvasRef} className="matrix-rain" />
}
