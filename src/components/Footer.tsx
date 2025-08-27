export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-8 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              国烟Go
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xs">
              国烟优选代购，北美直达，品质保证
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4">购买</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors py-1 block"
                >
                  最畅销
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors py-1 block"
                >
                  折扣
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4">支持</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors py-1 block"
                >
                  联系我们
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors py-1 block"
                >
                  常见问题
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-600 transition-colors py-1 block"
                >
                  物流配送
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 国烟Go. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
