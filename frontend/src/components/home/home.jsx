import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Chip, Skeleton } from "@mui/material";
import {
  MapPin,
  Clock,
  ArrowRight,
  Star,
  ShieldCheck,
  User,
} from "lucide-react";

const Homepage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Simulated data fetch
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTasks(new Array(6).fill({}));
      setLoading(false);
    }, 1500);
  }, []);

  const filters = [
    { id: "all", label: "All Tasks" },
    { id: "urgent", label: "Urgent", icon: <Clock className="w-4 h-4 mr-2" /> },
    { id: "top-paid", label: "Top Paid" },
    {
      id: "nearby",
      label: "Near Me",
      icon: <MapPin className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="space-y-12 ">
      {/* Value Propositions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-indigo-50 p-6 rounded-2xl">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-xl mr-4">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold">Verified Students</h3>
          </div>
          <p className="text-gray-600">
            All helpers are MSU-verified students with background checks
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Quick Help</h3>
          </div>
          <p className="text-gray-600">
            Average response time under 15 minutes
          </p>
        </div>

        <div className="bg-pink-50 p-6 rounded-2xl">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-pink-100 rounded-xl mr-4">
              <Star className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold">Rated Helpers</h3>
          </div>
          <p className="text-gray-600">
            Browse by ratings and previous reviews
          </p>
        </div>
      </motion.div>

      {/* Dynamic Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            label={
              <div className="flex items-center">
                {filter.icon}
                {filter.label}
              </div>
            }
            onClick={() => setActiveFilter(filter.id)}
            variant={activeFilter === filter.id ? "filled" : "outlined"}
            color="primary"
            className="!rounded-xl !px-3 !py-2"
          />
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? new Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  className="!h-48 !rounded-2xl"
                />
              ))
          : tasks.map((task, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                      <div className="bg-green-500 w-4 h-4 rounded-full" />
                    </div>
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        Grocery Shopping
                      </h3>
                      <Chip
                        label="Urgent"
                        color="error"
                        size="small"
                        className="!text-xs"
                      />
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>1.2mi · Spartan Village</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  Need someone to pick up groceries from Meijer. Detailed list
                  provided. Must be done today before 7 PM.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Chip
                      label="$25-30"
                      color="success"
                      variant="outlined"
                      className="!rounded-lg"
                    />
                    <div className="flex items-center text-sm text-amber-600">
                      <Star className="w-4 h-4 mr-1 fill-amber-500" />
                      <span>4.8 (12)</span>
                    </div>
                  </div>

                  <Button
                    variant="contained"
                    endIcon={<ArrowRight className="w-4 h-4" />}
                    className="!rounded-xl !px-4 !py-2 !text-sm"
                  >
                    Details
                  </Button>
                </div>
              </motion.div>
            ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white mt-16">
        <h2 className="text-2xl font-bold mb-4">
          Need Something Done Quickly?
        </h2>
        <p className="mb-6 opacity-90">
          Post your task and get offers from verified students within minutes
        </p>
        <Button
          variant="contained"
          className="!rounded-xl !px-8 !py-3 !text-lg !bg-white !text-indigo-600 hover:!bg-gray-100"
        >
          Post a Task
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
