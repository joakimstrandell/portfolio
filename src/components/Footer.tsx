import { PageContent } from './page';
import Link from 'next/link';
import AnimateContent from './AnimateContent';

export function Footer() {
  return (
    <AnimateContent>
      <footer className="border-t-8 border-black/10 bg-white/80">
        <PageContent className="grid max-w-7xl gap-4 py-12 sm:grid-cols-2 md:grid-cols-4 xl:py-32">
          <p className="leading-7">
            © 2025
            <br /> Joakim Strandell <br />
            <a
              className="footer-link"
              href="https://www.allabolag.se/foretag/awkward-group-ab/stockholm/konsulter/2K39PE4I5YF3I"
            >
              Awkward Group AB
            </a>
          </p>
          <div>
            <h4 className="mb-2 font-bold">Work</h4>
            <ul>
              <li>
                <Link className="footer-link" href="/work?category=projects">
                  Projects
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/work?category=concepts">
                  Concepts
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/work?category=thoughts">
                  Thoughts
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-bold">About</h4>
            <ul>
              <li>
                <Link className="footer-link" href="/about">
                  Readme
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/about#philosophy">
                  Philosophy
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/about#experience">
                  Experience
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/about#stack">
                  Work Stack
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/CV - Joakim Strandell.pdf">
                  CV as PDF
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-bold">Contact</h4>
            <ul>
              <li>
                <a className="footer-link" href="mailto:joakim@joakimstrandell.com">
                  joakim@joakimstrandell.com
                </a>
              </li>
              <li>
                <Link className="footer-link" href="tel:+46707294379">
                  +46 70 729 43 79
                </Link>
              </li>
              {/* <li>
            <Link href="https://github.com/joakimstrandell">Github</Link>
          </li>
          <li>
            <Link href="https://dribbble.com/joakim-strandell">Dribbble</Link>
          </li> */}
              <li>
                <Link className="footer-link" href="https://x.com/joakimstrandell">
                  X (Twitter)
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="https://linkedin.com/in/joakimstrandell">
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
        </PageContent>
      </footer>
    </AnimateContent>
  );
}
