import { FaBars, FaHistory, FaCube } from "react-icons/fa";
import { TbCircleDashed } from "react-icons/tb";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
const routes = [
  {
    num: 1,
    name: "Positions",
    icon: <FaCube />,
  },
  {
    num: 2,
    name: "Orders",
    icon: <TbCircleDashed />,
  },
  {
    num: 3,
    name: "History",
    icon: <FaHistory />,
  },
];
const Portfolio = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(1); // New state variable

  const toggle = () => setIsOpen(!isOpen);
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleRouteClick = (name) => {
    setSelectedRoute(name);
    console.log(name);
  };

  return (
    <>
      <div className="md:flex hidden items-center h-full bg-[#122337] text-white text-opacity-[90%]">
        <div className="main-container">
          <motion.div
            animate={{
              width: isOpen ? "200px" : "45px",

              transition: {
                duration: 0.5,
                type: "spring",
                damping: 10,
              },
            }}
            className={`sidebar `}
          >
            <div className="top_section">
              <AnimatePresence>
                {isOpen && (
                  <motion.h1
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="logo"
                  >
                    View
                  </motion.h1>
                )}
              </AnimatePresence>

              <div className="bars">
                <FaBars onClick={toggle} />
              </div>
            </div>

            <section className="routes">
              {routes.map((route, index) => {
                return (
                  <div
                    key={index}
                    className={`link`}
                    onClick={() => handleRouteClick(route.num)}
                  >
                    <div className="icon">{route.icon}</div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          variants={showAnimation}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="link_text"
                        >
                          {route.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </section>
          </motion.div>
        </div>
        {selectedRoute === 1 && <div>1</div>}
        {selectedRoute === 2 && <div>2</div>}
        {selectedRoute === 3 && <div>3</div>}
      </div>
    </>
  );
};

export default Portfolio;
