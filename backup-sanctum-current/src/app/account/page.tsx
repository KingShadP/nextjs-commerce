"use client";

import React, { useState, useEffect } from "react";
import { User, ShoppingBag, MapPin, Key, Award, ShieldAlert, Cpu, Terminal, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "address" | "keys">("orders");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);

  // Simulated system diagnostics boot on mount
  useEffect(() => {
    const logs = [
      "INITIALIZING SECURE CLIENT TRANS-NODE CONNECTIONS...",
      "FETCHING CLIENT CREDENTIAL REGISTER: KSD-PATRON-09827...",
      "VERIFYING LOCAL SYSTEM SHA-256 CONFIG CERTIFICATE...",
      "ESTABLISHING ATELIER SECURE SOCKET TUNNEL...",
      "HANDSHAKE ACCEPTED // PRINCIPAL SYSTEM OPERATOR AUTHORIZED."
    ];
    
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBootLogs((prev) => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsBooted(true), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const historicalOrders = [
    {
      id: "KSD-ORD-88294",
      date: "16 MAY 2026",
      total: "$152.00",
      status: "Cleared",
      dispatchNode: "NODE_01_EAST_FL",
      items: [
        { name: "Ribbed Boxer Brief", size: "M", color: "Onyx", qty: 2, price: "$56.00" },
        { name: "Fleece Lounge Hoodie", size: "M", color: "Cocoa", qty: 1, price: "$88.00" }
      ]
    },
    {
      id: "KSD-ORD-11928",
      date: "12 MAY 2026",
      total: "$70.00",
      status: "Cleared",
      dispatchNode: "NODE_03_WEST_CA",
      items: [
        { name: "Stretch Muscle Tank", size: "L", color: "Sand", qty: 1, price: "$36.00" },
        { name: "Lounge Crewneck Tee", size: "L", color: "Clay", qty: 1, price: "$34.00" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 space-y-12 font-mono select-none text-left">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/10 pb-8 gap-6 text-left relative">
        <div className="absolute top-0 right-0 w-24 h-[1px] bg-skims-accent/30" />
        <div className="space-y-3">
          <span className="text-[8px] text-skims-accent tracking-[3px] uppercase block">
            PATRON DATABASE // SECURE OPERATOR ACCESS
          </span>
          <h1 className="font-serif text-3xl md:text-4.5xl text-white uppercase tracking-wider font-light">
            Vault Profile
          </h1>
          <p className="font-sans text-xs text-skims-sand/55 leading-relaxed font-light">
            Identity clearance authenticated. Welcome back, <span className="text-white font-bold">Principal Operator</span>.
          </p>
        </div>

        <div className="text-right text-[8.5px] text-skims-sand/40 uppercase tracking-[2px]">
          <div>CLIENT REGISTER: <span className="text-white">KSD-PATRON-09827</span></div>
          <div className="mt-1">LEVEL LAYER: <span className="text-skims-accent font-bold">VIP_COGNITIVE_SECURE_V9</span></div>
        </div>
      </div>

      {/* Terminal Diagnostics System Loader */}
      <AnimatePresence>
        {!isBooted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="glass-panel border border-skims-accent/20 p-5 rounded-2xl bg-black/40 text-[9px] text-skims-accent/90 space-y-2 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-[10px] font-bold">
              <Cpu className="w-4 h-4 animate-spin text-skims-accent" />
              <span>[SYSTEM DIAGNOSTIC SHELL INT]</span>
            </div>
            <div className="space-y-1 font-mono">
              {bootLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-white/20">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ opacity: isBooted ? 1 : 0.4 }}
        className="flex flex-col lg:flex-row gap-12 items-start"
      >
        
        {/* Left Side: Navigation Links & Profile Summary */}
        <div className="w-full lg:w-[32%] space-y-8">
          <div className="glass-panel border border-white/10 p-6 space-y-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border border-skims-accent/30 rounded-full flex items-center justify-center bg-black/40 relative">
                <User className="w-5 h-5 text-skims-accent" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black" />
              </div>
              <div className="text-left">
                <h3 className="text-[12px] text-white font-bold uppercase">Principal Operator</h3>
                <span className="text-[9px] text-skims-sand/40 select-text">principal@kshadp.com</span>
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Profile Tab Navigation */}
            <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[1.5px]">
              {[
                { id: "orders", label: "[LEDGER: ACQUISITIONS]", icon: ShoppingBag },
                { id: "address", label: "[LOGISTICS: DISPATCH_NODES]", icon: MapPin },
                { id: "keys", label: "[CREDENTIAL: SECURITY_KEYS]", icon: Key }
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 p-3.5 border transition-all cursor-pointer rounded-xl font-bold ${
                      isSelected
                        ? "border-skims-accent bg-skims-accent/5 text-skims-accent shadow-[0_0_8px_rgba(197,168,128,0.2)]"
                        : "border-transparent text-skims-sand/55 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Security alert ledger */}
          <div className="border border-red-500/20 bg-red-500/5 p-5 space-y-2.5 text-[10px] rounded-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>SECURITY VAULT MEMORANDUM</span>
            </div>
            <p className="font-sans text-white/45 leading-relaxed font-light select-text">
              All transactions are encrypted with local SHA-256 signatures. Coordinates and purchases are locked to your client hardware footprint. Reverse engineering parameters terminates access.
            </p>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="w-full lg:w-[68%] glass-panel border border-white/10 p-6 md:p-8 min-h-[420px] rounded-3xl shadow-xl">
          
          {/* ORDERS LOG TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-[10px] uppercase tracking-[2.5px] text-white font-bold flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-skims-accent" />
                  Acquisition Logs
                </h2>
                <span className="text-[7.5px] text-white/20 tracking-[1px] font-mono">// DB_ORDER_ROWS</span>
              </div>

              <div className="space-y-6">
                {historicalOrders.map((order) => (
                  <div key={order.id} className="border border-white/5 p-5 bg-black/40 space-y-4 rounded-xl">
                    <div className="flex flex-wrap justify-between items-center text-[10.5px] gap-3 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-white/30 font-bold uppercase">[SYS: INV_ID]</span>{" "}
                        <span className="text-white font-mono font-bold">{order.id}</span>
                      </div>
                      <div className="text-white/30 font-bold uppercase">
                        [DATE] <span className="text-white font-mono font-medium">{order.date}</span>
                      </div>
                      <div>
                        [STATE]: <span className="text-green-400 font-bold font-mono">{order.status.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div className="text-left">
                            <h4 className="font-serif text-white uppercase font-light text-[12px]">{item.name}</h4>
                            <p className="text-[8px] text-skims-sand/40 uppercase mt-0.5 tracking-[1px]">
                              SIZE: {item.size} / HUE: {item.color} / UNITS: 0{item.qty}
                            </p>
                          </div>
                          <span className="text-white font-mono font-bold">{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-white/30 uppercase tracking-[1.5px]">[LEDGER_BAL: SHIFTED]</span>
                      <span className="text-skims-accent">{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADDRESS REGISTRY LOG TAB */}
          {activeTab === "address" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-[10px] uppercase tracking-[2.5px] text-white font-bold flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-skims-accent" />
                  Logistics Dispatch Nodes
                </h2>
                <span className="text-[7.5px] text-white/20 tracking-[1px] font-mono">// GEOC_DEST_NODES</span>
              </div>

              <div className="border border-white/5 p-5 bg-black/40 space-y-4 max-w-md rounded-xl">
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <span className="text-skims-accent tracking-[2px] uppercase">PRIMARY TRANS-NODE DESTINATION</span>
                  <span className="text-white/20 tracking-[1px]">// DEFAULT_GATEWAY</span>
                </div>
                
                <div className="text-[11px] space-y-1.5 text-white/70 text-left font-sans font-light leading-relaxed select-text">
                  <p className="font-mono font-bold text-white uppercase tracking-[1px]">Principal Operator</p>
                  <p>108 Cliffside Ridge Way</p>
                  <p>Miami, Florida 33139</p>
                  <p>United States</p>
                </div>

                <div className="pt-2">
                  <button className="px-4 py-2 border border-white/10 hover:border-skims-accent text-skims-sand hover:text-white text-[8.5px] uppercase tracking-[2px] transition-all duration-300 cursor-pointer rounded-full bg-black/20">
                    Edit Registry Coordinates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CREDENTIAL KEYS LOG TAB */}
          {activeTab === "keys" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-[10px] uppercase tracking-[2.5px] text-white font-bold flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-skims-accent" />
                  Verified Security Keys
                </h2>
                <span className="text-[7.5px] text-white/20 tracking-[1px] font-mono">// SEC_KEYS_REGISTRY</span>
              </div>

              <div className="space-y-4">
                <div className="border border-white/5 p-4 bg-black/40 flex justify-between items-center text-[10px] rounded-xl text-left">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-skims-accent" />
                    <div>
                      <span className="font-bold text-white block uppercase tracking-[1px]">PATRON VERIFIED SECURITY TICKET</span>
                      <span className="text-[7.5px] text-white/30 uppercase tracking-widest block font-mono mt-0.5">SHA-256 Digital Certificate signature validated</span>
                    </div>
                  </div>
                  <span className="text-green-400 font-bold uppercase text-[9px] font-mono">ACTIVE</span>
                </div>

                <div className="border border-white/5 p-4 bg-black/40 flex justify-between items-center text-[10px] rounded-xl text-left">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-skims-accent" />
                    <div>
                      <span className="font-bold text-white block uppercase tracking-[1px]">SHOPIFY VAULT HANDSHAKE TOKEN</span>
                      <span className="text-[7.5px] text-white/30 uppercase tracking-widest block font-mono mt-0.5">Storefront API read access token configured</span>
                    </div>
                  </div>
                  <span className="text-green-400 font-bold uppercase text-[9px] font-mono">ACTIVE</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </motion.div>

    </div>
  );
}
