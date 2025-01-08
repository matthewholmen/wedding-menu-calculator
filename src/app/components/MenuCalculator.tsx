'use client'

import React, { useState } from 'react';
import { menuData } from '../data/menu';

const BUNDLE_DISCOUNTS = {
  'welcome bite': {
    requiredCount: 3,
    bundlePrice: 12
  },
  'supper club grazing table': {
    requiredCount: 4,
    bundlePrice: 26
  },
  'accouterments': {
    requiredCount: 3,
    bundlePrice: 12
  },
  'main': {
    requiredCount: 3,
    bundlePrice: 72
  }
};

export default function MenuCalculator() {
  const [guestCount, setGuestCount] = useState(100);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (course: string, name: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [`${course}-${name}`]: !prev[`${course}-${name}`]
    }));
  };

  const isEligibleForBundle = (course: string, items: typeof menuData) => {
    if (!BUNDLE_DISCOUNTS[course as keyof typeof BUNDLE_DISCOUNTS]) return false;
    
    const selectedCount = items.filter(item => 
      selectedItems[`${course}-${item.name}`]
    ).length;
    
    return selectedCount === BUNDLE_DISCOUNTS[course as keyof typeof BUNDLE_DISCOUNTS].requiredCount;
  };
  
  const calculateCourseTotal = (course: string, items: typeof menuData) => {
    if (isEligibleForBundle(course, items)) {
      return BUNDLE_DISCOUNTS[course as keyof typeof BUNDLE_DISCOUNTS].bundlePrice * guestCount;
    }
    
    return items.reduce((total, item) => {
      if (selectedItems[`${course}-${item.name}`]) {
        return total + (item.price * guestCount);
      }
      return total;
    }, 0);
  };
  
  const calculateTotal = () => {
    return Object.entries(groupedMenu).reduce((total, [course, items]) => {
      return total + calculateCourseTotal(course, items);
    }, 0);
  };
  
  const groupedMenu = menuData.reduce((groups, item) => {
    if (!groups[item.course]) {
      groups[item.course] = [];
    }
    groups[item.course].push(item);
    return groups;
  }, {} as Record<string, typeof menuData>);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Wedding Menu Calculator</h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">
            Guest Count:
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 0))}
              className="ml-2 p-1 border rounded w-24"
            />
          </label>
          <div className="text-lg font-bold">
            Total: ${calculateTotal().toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {Object.entries(groupedMenu).map(([course, items]) => {
          const bundleDiscount = BUNDLE_DISCOUNTS[course as keyof typeof BUNDLE_DISCOUNTS];
          const isBundle = isEligibleForBundle(course, items);
          const courseTotal = calculateCourseTotal(course, items);
          
          return (
            <div key={course} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {course}
                {bundleDiscount && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (All {bundleDiscount.requiredCount} for ${bundleDiscount.bundlePrice}/person)
                  </span>
                )}
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems[`${course}-${item.name}`] || false}
                      onChange={() => toggleItem(course, item.name)}
                      className="w-4 h-4"
                    />
                    <span className="flex-grow">{item.name}</span>
                    <span className="text-sm font-medium">
                      ${item.price}/person
                      {selectedItems[`${course}-${item.name}`] && !isBundle && (
                        <span className="ml-2 text-gray-500">
                          (${(item.price * guestCount).toLocaleString()} total)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {isBundle && (
                  <div className="text-sm text-green-600 mt-1">
                    Bundle discount applied! Total for {course}: ${courseTotal.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}