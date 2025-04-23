const PrintableKeywordListPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <h1 className="mb-10 scroll-m-20 text-center text-3xl font-bold tracking-tight lg:text-5xl">
        Keywords
      </h1>
      <div className="grid grid-cols-3 gap-2">
        <div className="pt-4">
          <h2 className="text-lg font-semibold">
            Academics (other than the Arts)
          </h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Consumer Science</li>
            <li>Study Skills</li>
            <li>Career Development</li>
            <li>Health</li>
            <li>Languages Other Than English</li>
            <li>Math</li>
            <li>Science</li>
            <li>Social Studies / History</li>
            <li>Technology</li>
            <li>Common Core</li>
            <li>STEM / STEAM</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Art</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Media Art</li>
            <li>Visual Art</li>
            <li>Art Instruction</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Music</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Accompanist for Music/Dance Students</li>
            <li>Clinician</li>
            <li>Conductor</li>
            <li>Instrumental Music</li>
            <li>Vocal Music</li>
            <li>Music Instruction</li>
            <li>Music Performance</li>
            <li>Composer</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">School Play / Drama</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Accompanist for School Play/Drama</li>
            <li>Choreographer</li>
            <li>Costume Designer</li>
            <li>Music Director</li>
            <li>Set, Lighting, Sound Designer</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Youth Safety</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Anti-Bullying</li>
            <li>Conflict Resolution</li>
            <li>Cyber-Bullying</li>
            <li>Suicide Prevention / Depression</li>
            <li>Alcohol / Vaping / Controlled Substance Abuse</li>
            <li>Driver Safety</li>
            <li>Internet Safety / Social Media</li>
            <li>Peer Pressure</li>
            <li>Sex Education</li>
            <li>Stranger Danger</li>
            <li>Fire Safety</li>
            <li>Alcohol/Controlled Substance Abuse</li>
            <li>Mental Health</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Character Ed</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Anger Management</li>
            <li>Empowerment</li>
            <li>Motivation</li>
            <li>Self-Esteem / Self-Control</li>
            <li>Citizenship</li>
            <li>Emotional Well Being</li>
            <li>Dignity Act</li>
            <li>Self Control</li>
            <li>Team Building</li>
            <li>Character Education</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Literature</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Literacy</li>
            <li>Poetry</li>
            <li>Reading</li>
            <li>Writing</li>
            <li>English Language Arts (ELA)</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Author Visits</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Storyteller</li>
            <li>Writer (also Poet)</li>
            <li>Illustrator</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Topical</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>American Indian</li>
            <li>Black History</li>
            <li>Cultural Diversity</li>
            <li>Hispanic Heritage</li>
            <li>Holiday</li>
            <li>Holocaust</li>
            <li>Women's History</li>
            <li>American History</li>
            <li>Biographical</li>
            <li>Environment</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Dance</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Dance Instruction</li>
            <li>Dance Performance</li>
          </ul>
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Theater</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Theater Instruction</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrintableKeywordListPage;
