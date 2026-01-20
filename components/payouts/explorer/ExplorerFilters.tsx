
import React, { useEffect, useState } from 'react';
import { Button } from '../../common/Button';
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Props { allItems: any[]; onFilter: (items: any[]) => void; }

export const ExplorerFilters: React.FC<Props> = ({ allItems, onFilter }) => {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let res = allItems;
    if (search) {
      const s = search.toLowerCase();
      res = res.filter(i => i.accountName.toLowerCase().includes(s) || (i.transferId && i.transferId.toLowerCase().includes(s)));
    }
    if (platform !== 'All') {
      res = res.filter(i => i.platform === platform);
    }
    onFilter(res);
  }, [search, platform, allItems, onFilter]);

  return (
    <div className="theme-bg-card border theme-border rounded-xl sticky top-20 overflow-hidden shadow-md">
      <div 
        className="p-4 flex justify-between items-center md:hidden cursor-pointer theme-bg-subtle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold theme-text-main flex items-center gap-2 text-sm">
          <Filter size={14} /> Filter & Search
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>

      <div className={`p-5 space-y-5 ${isOpen ? 'block' : 'hidden'} md:block`}>
        <h3 className="text-xs font-bold theme-text-main uppercase tracking-widest mb-4 hidden md:block">Refine Results</h3>
        
        <div className="space-y-1.5">
          <label className="text-[10px] theme-text-sub uppercase font-bold tracking-widest">Search Transactions</label>
          <div className="relative mt-1">
            <input className="w-full theme-bg-page border theme-border p-2.5 pl-9 text-sm theme-text-main rounded transition-all focus:border-[#FF2D92] outline-none" 
              placeholder="Account or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            <Search size={14} className="absolute left-3 top-3 theme-text-sub opacity-50" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] theme-text-sub uppercase font-bold tracking-widest">Platform</label>
          <select className="w-full mt-1 theme-bg-page border theme-border p-2.5 text-sm theme-text-main rounded outline-none focus:border-[#FF2D92]"
             value={platform} onChange={e => setPlatform(e.target.value)}>
            <option value="All">All Platforms</option>
            <option value="Amazon">Amazon</option>
            <option value="Shopify">Shopify</option>
          </select>
        </div>

        <div className="pt-4">
          <Button variant="secondary" className="w-full justify-center bg-white/[0.03] text-xs h-10" onClick={() => { setSearch(''); setPlatform('All'); }}>
            Reset All
          </Button>
        </div>
      </div>
    </div>
  );
};
