import React from "react";
import {Link} from "react-router-dom";

function Footer() {
  return (
      <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <Link to='/tendertracker'>Copyright © zigma.com 2022</Link>
            </div>
          </div>
      </footer>
  );
}

export default Footer;
