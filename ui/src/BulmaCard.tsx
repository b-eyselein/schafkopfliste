import { useState } from 'react';
import {Link} from 'react-router-dom';
import {GoChevronDown, GoChevronLeft} from 'react-icons/go';

interface IProps {
  title: string;
  children: JSX.Element;
  links?: {
    text: string;
    to: string;
  }[];
  isReducible?: boolean;
  isReducedInitially?: boolean;
}

export function BulmaCard({title, children, links, isReducible, isReducedInitially}: IProps): JSX.Element {

  const [isReduced, setIsReduced] = useState(isReducedInitially || false);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{title}</p>
        {isReducible && <button type="button" className="card-header-icon" onClick={() => setIsReduced((value) => !value)}>
          {isReduced ? <GoChevronLeft/> : <GoChevronDown/>}
        </button>}
      </header>
      {!isReduced && <div className="card-content">{children}</div>}
      {links && links.length > 0 && <footer className="card-footer">
        {links.map(({text, to}) => <Link to={to} className="card-footer-item" key={to}>{text}</Link>)}
      </footer>}
    </div>
  );
}
