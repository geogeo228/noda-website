import { Helmet } from 'react-helmet-async'
import SlideDeck from '../deck/SlideDeck'
import { getDict } from '../deck/content'
import {
  Cover, Niches, CaseContractors, CasePassports, CasePhotobooth, CaseSales, CaseContent,
  Capabilities, Services, Why, Founder, Contact,
} from '../deck/slides'

// Клиентская презентация, 13 слайдов. Закрыта от индексации и не входит в
// sitemap и меню: ссылку отдаёт Георгий. Метатеги для статики лежат в
// src/routes.js (hiddenRoutes), здесь те же значения для клиентского рендера.
const slides = [
  { id: 's01', node: (c) => <Cover c={c} /> },
  { id: 's02', node: (c) => <Niches c={c} /> },
  { id: 's03', node: (c) => <CaseContractors c={c} /> },
  { id: 's04', node: (c) => <CasePassports c={c} /> },
  { id: 's05', node: (c) => <CasePhotobooth c={c} /> },
  { id: 's06', node: (c) => <CaseSales c={c} /> },
  { id: 's07', node: (c) => <CaseContent c={c} /> },
  { id: 's08', node: (c, a) => <Capabilities c={c} active={a} /> },
  { id: 's09', node: (c, a) => <Capabilities c={c} active={a} /> },
  { id: 's10', node: (c) => <Services c={c} /> },
  { id: 's11', node: (c) => <Why c={c} /> },
  { id: 's12', node: (c) => <Founder c={c} /> },
  { id: 's13', node: (c) => <Contact c={c} /> },
]

export default function Deck() {
  const ui = getDict('ru').ui
  return (
    <>
      <Helmet>
        <title>{ui.docTitleDeck}</title>
        <meta name="description" content={ui.docDesc} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SlideDeck slides={slides} kind="deck" />
    </>
  )
}
