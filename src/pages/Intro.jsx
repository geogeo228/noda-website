import { Helmet } from 'react-helmet-async'
import SlideDeck from '../deck/SlideDeck'
import { getDict } from '../deck/content'
import { Cover, Niches, Results, Founder, Together, Contact } from '../deck/slides'

// Визитка, 6 слайдов. Как и /deck: noindex, вне sitemap и меню.
const slides = [
  { id: 's01', node: (c) => <Cover c={c} /> },
  { id: 's02', node: (c) => <Niches c={c} /> },
  { id: 's03', node: (c) => <Results c={c} /> },
  { id: 's04', node: (c) => <Founder c={c} /> },
  { id: 's05', node: (c) => <Together c={c} /> },
  { id: 's06', node: (c) => <Contact c={c} /> },
]

export default function Intro() {
  const ui = getDict('ru').ui
  return (
    <>
      <Helmet>
        <title>{ui.docTitleIntro}</title>
        <meta name="description" content={ui.docDesc} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SlideDeck slides={slides} kind="intro" />
    </>
  )
}
