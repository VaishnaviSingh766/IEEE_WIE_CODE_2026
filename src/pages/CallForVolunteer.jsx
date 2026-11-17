import cfvImage from "../assets/CFV/CallForVolunteer.png";
import brochurePdf from "../assets/CFV/CallForVolunteer.pdf";
import Divider from "../utils/Separator";
import Button from "../utils/Button";
import "../cssfiles/font.css";
import "../cssfiles/CallForVolunteer.css";

/**
 * Call for Volunteers section.
 *
 * Props (all optional):
 *   brochureSrc   image shown on the left   (default: /images/volunteer-brochure.png)
 *   brochureAlt   text description of the image
 *   registerHref  where the Register button goes   (default: /registrations)
 *   downloadHref  file the Download Brochure button saves
 *
 * When you have the new brochure, only change `brochureSrc` (and `downloadHref`).
 */
export default function CallForVolunteers({
  brochureSrc = cfvImage,
  brochureAlt = "WIE Code 2K26 call for volunteers brochure",
  registerHref = "https://docs.google.com/forms/d/e/1FAIpQLSfRs-_7fB3-Z5f-VAo8Rs161leTKmN5qp_uCZoHNC2jMmgXSA/viewform",
  downloadHref = brochurePdf,
}) {
  const handleRegister = () => {
    window.open(registerHref, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = downloadHref;
    a.download = "CallForVolunteer.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  
  return (
    <section className="cfv font-paragraph" aria-labelledby="cfv-title">
      <div className="cfv-bg" aria-hidden="true">
        <span className="cfv-sw a" />
        <span className="cfv-sw b" />
        <span className="cfv-sw c" />
      </div>

      <div className="cfv-wrap">
        <h2 id="cfv-title" className="cfv-title font-heading">
          Call for Volunteers
        </h2>
        <Divider />

        <div className="cfv-grid">
          <figure className="cfv-fig">
            <img src={brochureSrc} alt={brochureAlt} />
          </figure>

          <div className="cfv-card">
            <p className="font-paragraph">
              Call for Volunteers is an opportunity for individuals to
              contribute to the successful execution of WIE Code Hackathon
              2026. Volunteers will assist in various aspects of event
              management while gaining valuable experience, enhancing their
              skills, and networking with a vibrant tech community.
            </p>
            <p className="font-paragraph">
              As a volunteer, you will play a crucial role in various aspects
              of the event, making a meaningful impact and being part of a
              prestigious hackathon. If you're interested, reach out to us and
              become a part of the team!
            </p>
          </div>
        </div>

        <div className="cfv-actions">
          <Button className="cfv-action font-subheading" onClick={handleRegister}>
            Register
          </Button>
          <Button className="cfv-action font-subheading" onClick={handleDownload}>
            Download Brochure
          </Button>
        </div>
      </div>
    </section>
  );
}