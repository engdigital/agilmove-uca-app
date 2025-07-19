import ReadingPageContent from "@/components/reading-page-content"

interface ReadingPageProps {
  params: {
    scrollId: string
  }
}

// Função necessária para export estático
export async function generateStaticParams() {
  // Gerar parâmetros para scrollIds de 1 a 24
  return Array.from({ length: 24 }, (_, i) => ({
    scrollId: (i + 1).toString(),
  }))
}

export default function ReadingPage({ params }: ReadingPageProps) {
  const scrollId = Number(params.scrollId)
  return <ReadingPageContent scrollId={scrollId} />
}
