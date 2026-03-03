export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
          .custom-rubik { font-family: 'Rubik', sans-serif; }
        `
      }} />
      <div className="custom-rubik">
        {children}
      </div>
    </>
  )
}
