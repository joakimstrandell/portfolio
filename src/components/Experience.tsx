type Skill =
  | 'React'
  | 'TypeScript'
  | 'Design Systems'
  | 'Frontend Development'
  | 'API Design'
  | 'UX Design'
  | 'UI Design'
  | 'Developer Tooling'
  | 'Git'
  | 'Docker'
  | 'CI/CD'
  | 'Testing'
  | 'Performance Optimization'
  | 'Accessibility'
  | 'Internationalization'
  | 'Localization';

export function Experience({
  title,
  period,
  type,
  time,
  role,
  description,
  skills,
  children,
}: {
  title: string;
  period: string;
  type: string;
  time: string;
  role: string;
  description: string;
  skills: Skill[];
  children: React.ReactNode;
}) {
  return (
    <div className="prose">
      <h2>
        {title} · {period}
      </h2>
      <p className="text-muted-foreground">
        {type} · {time} · {role}
      </p>
      <p>{description}</p>
      <ul className="list-inside list-disc">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <div>{children}</div>
    </div>
  );
}
