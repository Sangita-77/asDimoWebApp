import React from "react";
import "./ModulesStyles.css";
import { Heading4, Heading5, Paragraph, UnorderedList, MiniHeading5, TinyPara } from "../ui/HeadingPara";
import Button from "../ui/Buttons";
import { DeleteIcon} from "lucide-animated";
import PhoneIcon from "../../assets/Images/PhoneIcon.svg";
import EmailIcon from "../../assets/Images/MailIcon.svg";
import LocationIcon from "../../assets/Images/MapIconHandle.svg";
import ORGProf from "../../assets/Images/ORGProf.svg";
import ChildrenIcon from "../../assets/Images/ChildrenIcon.svg";
import SubscriptionIcon from "../../assets/Images/SubscriptionIcon.svg";
import AttentionIcon from "../../assets/Images/AttentionIcon.png";
import CommunicationIcon from "../../assets/Images/CommunicationIcon.png";
import PuzzleIcon from "../../assets/Images/PuzzleIcon.png";
import EmotionsIcon from "../../assets/Images/EmotionsIcon.png";




const games = [
  { name: "Puzzle", icon: AttentionIcon, },
  { name: "Memory", icon: CommunicationIcon, },
  { name: "Memory", icon: PuzzleIcon, },
  { name: "Memory", icon: EmotionsIcon, },
]; 

const admins = [
  { value: "admin", label: "Admin" },
  { value: "admin2", label: "Admin 2" },
  { value: "admin3", label: "Admin 3" },
];

const skills = [
  {
    icon: "●",
    name: "Communication",
    time: "56 min",
    progress: 42,
    status: "Improving",
    direction: "↑",
  },
  {
    icon: "♥",
    name: "Social Interaction",
    time: "32 min",
    progress: 24,
    status: "Steady",
    direction: "↓",
  },
  {
    icon: "♧",
    name: "Behavior",
    time: "01 hr",
    progress: 51,
    status: "Improving",
    direction: "↑",
  },
  {
    icon: "✎",
    name: "Cognitive",
    time: "1.5 hr",
    progress: 65,
    status: "Improving",
    direction: "↑",
  },
  {
    icon: "✋",
    name: "Motor Skills",
    time: "25 min",
    progress: 20,
    status: "Steady",
    direction: "↓",
  },
];

const chartData = [55, 75, 32, 20, 25, 74, 28];


const UserDetail: React.FC= ({
}) => {

  return (
    <div className="UserDeatilswrap">
      <div className="UserDeatils d-flex">
        <div className="User_Status">
          <span></span> Active User
          <Paragraph text="Last login: 27-03-2026"/>
        </div>
        <div className="Actiom_btn">
            <Button text="Delete User" textsize="md" variant="red" icon=<DeleteIcon size={20}/> />
        </div>
    </div>
    <div className="profile-page">
      <div className="dashboard-grid">

        {/* Profile */}
        <section className="card profile-card">
          <div className="profile-main">
            <div className="avatar">DJ</div>

            <div className="profile-info">
              <div className="profile-title-row">
                <Heading5 text="David Johnson" />
                {/* <button className="edit-btn"><img src={PenIcon} alt="Edit" className="btn-icon" /> Edit</button> */}
              </div>
                <UnorderedList
                  variant="icon"
                  iconsize={20}
                  items={[
                    { icon: PhoneIcon, text: "+1234 567 890" },
                    { icon: EmailIcon, text: "david.johnson@email.com" },
                    { icon: LocationIcon, text: "742 Everygreen Terrace, Springfield" },
                  ]}
                />
            </div>
          </div>
        </section>

        {/* Child Details */}
        <section className="card child-card">
          <div className="organization">
            <div className="organization-icon"> <img src={ORGProf} /></div>
            <div>
              <Heading5 text="Organization Name"/>
              <Paragraph text="Therapist Name"/>
            </div>
          </div>

          <div className="divider" />

          <Heading4 text="Child details"/>
          <div className="child-info">
            <div className="child-avatar"><img src={ChildrenIcon} /></div>
            <div className="child-name">
              <MiniHeading5 text="Child Name (Mask)"/>
              <TinyPara text="Age: 7"/>
            </div>

            <div className="child-grade">
              <TinyPara text="1st Grade"/>
            </div>

            <span className="school-badge">ORG Type</span>
          </div>
        </section>

        {/* Last Buy */}
        <section className="card last-buy-card">
          <div className="card-title-row">
            <Heading5 text="Last-Buy"/>
          </div>

          <div className="last-buy-list">
            <Paragraph text="Cooming Soon..."/>
          </div>
        </section>

        {/* Subscription */}
        <section className="card subscription-card">
            <Heading5 text="Subscription Details"/>
          <div className="subscription-content">
            <div className="subscription-icon"> <img src={SubscriptionIcon} /></div>

            <div className="subscription-main">
              <Heading4 text="Premium"/>
              <Paragraph text="Start Date: 11/11/1111"/>
              <Paragraph text="Cost: $195/year"/>
            </div>

            <div className="subscription-side">
              <Paragraph text="Renewal Date:"/>
              <Paragraph text="01/02/2023"/>
            </div>
          </div>
        </section>

        {/* Appointment */}
        <section className="card appointment-card">
            <Heading5 text="Appointment Details"/>
          <div className="appointment-person">
            <div className="doctor-avatar">SM</div>
            <div>
              <Heading4 text="Therapist Name"/>
              <Paragraph text="10.00AM - 11.00 AM"/>
            </div>
          </div>
        </section>

        {/* Games */}
        <section className="card games-card">
          <Heading5 text="Games" />

          <div className="games-list">
            {games.map((game, index) => (
              <div className="game-icon" key={index}>
                <img
                  src={game.icon}
                  alt={game.name || "Game icon"}
                  className="game-icon-image"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Psychological */}
        <section className="card psychological-card">
          <Heading5 text="Psychological Evaluation"/>
          <MiniHeading5 text="Child Details"/>
          <Paragraph text="Hyper"/>
        </section>

        {/* Assigned Admin */}
        <section className="card assigned-card">
          <div className="assigned-header">
           <Heading5 text="Child Deatils"/>
            <button>Save</button>
          </div>
          <MiniHeading5 text="Admin"/>
            <select defaultValue="admin">
              {admins.map((admin) => (
                <option key={admin.value} value={admin.value}>
                  {admin.label}
                </option>
              ))}
            </select>
        </section>

        {/* Skills */}
        <section className="skills-section">
          <div className="skills-header">
            <div className="target-icon">🎯</div>
            <Heading5 text="Skills Practiced"/>
          </div>

          <div className="skills-content">

            <div className="skills-list">
              {skills.map((skill, index) => (
                <div className="skill-row" key={index}>
                  <div className={`skill-icon skill-${index}`}>
                    {skill.icon}
                  </div>

                  <strong className="skill-name">
                    {skill.name}
                  </strong>

                  <div className="skill-progress">
                    <div
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>

                  <span className="skill-time">
                    {skill.time}
                  </span>

                  <div
                    className={`skill-status ${
                      skill.status === "Steady" ? "steady" : ""
                    }`}
                  >
                    <span className="status-face">
                      {skill.status === "Improving" ? "☺" : "☹"}
                    </span>

                    <span>{skill.status}</span>
                    <strong>{skill.direction}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Timing Report */}
            <div className="timing-report">
              <button className="report-btn">
                Timing report
              </button>

              <div className="chart">
                <div className="chart-y">
                  <span>100%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                <div className="chart-area">
                  <div className="grid-line line-100" />
                  <div className="grid-line line-50" />
                  <div className="grid-line line-25" />

                  <div className="bars">
                    {chartData.map((height, index) => (
                      <div className="bar-wrapper" key={index}>
                        <div
                          className="bar"
                          style={{ height: `${height}%` }}
                        />
                        <span>
                          {
                            [
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                              "Sun",
                            ][index]
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
    </div>

    
  );
};

export default UserDetail;