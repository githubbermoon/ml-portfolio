import { Github, Linkedin, Mail, FolderOpen } from 'lucide-react';

interface FooterLinksProps {
  base: string;
}

export default function FooterLinks({ base }: FooterLinksProps) {
  const links = [
    { name: 'Projects', href: `${base}projects/`, icon: FolderOpen },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/pranjal-prakash', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/githubbermoon', icon: Github },
    { name: 'Email', href: 'mailto:prakashpranjal001@gmail.com', icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-3">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="group flex items-center gap-4 py-2 w-fit transition-all duration-300"
        >
          <div className="p-2 rounded-xl group-hover:bg-white/10 transition-all duration-300">
            <link.icon className="w-5 h-5 text-mist group-hover:text-white transition-colors" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-mist group-hover:text-white transition-colors">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
}
