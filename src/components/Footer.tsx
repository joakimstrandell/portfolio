import { Container } from './Container';
import { Link } from '@tanstack/react-router';

export function Footer() {
  return (
    <div className="border-border -mt-2 border-t-8">
      <Container padding="top-bottom" paddingSize="md" width="wider" asChild>
        <footer className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <p className="leading-7">
            © {new Date().getFullYear()}
            <br /> Joakim Strandell <br />
            <a
              className="footer-link"
              href="https://www.allabolag.se/foretag/awkward-group-ab/stockholm/konsulter/2K39PE4I5YF3I"
            >
              Awkward Group AB
            </a>
          </p>
          <div>
            <h4 className="mb-2 font-bold">
              <Link className="footer-link" to="/work" search={{ category: 'projects' }}>
                Work
              </Link>
            </h4>
            <ul>
              <li>
                <Link className="footer-link" to="/work/client">
                  Client Work
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/work">
                  Personal Projects
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-bold">
              <Link className="footer-link" to="/readme">
                Readme
              </Link>
            </h4>
            <ul>
              <li>
                <Link className="footer-link" to="/readme" hash="philosophy">
                  Philosophy
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/readme" hash="stack">
                  Work Stack
                </Link>
              </li>
              <li>
                <a className="footer-link" href="/Joakim_Strandell_Fullstack_Designer_CV.pdf">
                  Employment CV
                </a>
              </li>
              <li>
                <a className="footer-link" href="/Joakim_Strandell_Fullstack_Designer_Consultant_CV.pdf">
                  Consultant CV
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-bold">
              <Link className="footer-link" to="/connect">
                Connect
              </Link>
            </h4>
            <ul>
              <li>
                <a className="footer-link" href="mailto:joakim@joakimstrandell.com">
                  joakim@joakimstrandell.com
                </a>
              </li>
              <li>
                <a className="footer-link" href="tel:+46707294379">
                  +46 70 729 43 79
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://linkedin.com/in/joakimstrandell">
                  LinkedIn
                </a>
              </li>
              <li>
                <a className="footer-link" href="https://github.com/joakimstrandell">
                  Github
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </Container>
    </div>
  );
}
