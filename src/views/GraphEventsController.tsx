import { useRegisterEvents, useSigma } from '@react-sigma/core'
import { FC, useEffect, ReactNode } from 'react'
import { FiltersState } from '../types'

function getMouseLayer () {
  return document.querySelector('.sigma-mouse')
}

const GraphEventsController: FC<{
  setHoveredNode: (node: string | null) => void
  filters: FiltersState
  children?: ReactNode
}> = ({ setHoveredNode, filters, children }) => {
  const sigma = useSigma()
  const graph = sigma.getGraph()
  const registerEvents = useRegisterEvents()

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    registerEvents({
      clickNode ({ node }) {
        if (!graph.getNodeAttribute(node, 'hidden')) {
          window.open(
            graph.getNodeAttribute(node, 'url') + `?lang=${filters.language}`,
            '_blank'
          )
        }
      },
      enterNode ({ node }) {
        setHoveredNode(node)
        // TODO: Find a better way to get the DOM mouse layer:
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.add('mouse-pointer')
      },
      leaveNode () {
        setHoveredNode(null)
        // TODO: Find a better way to get the DOM mouse layer:
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.remove('mouse-pointer')
      }
    })
  }, [filters.language])

  return <>{children}</>
}

export default GraphEventsController
