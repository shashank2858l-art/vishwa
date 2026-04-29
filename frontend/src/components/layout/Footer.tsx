"use client";

import { Globe, MessageCircle, Phone, Mail, Heart } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { SocialCard } from "@/components/ui/SocialCard";
import { useI18n } from "@/lib/i18n/I18nContext";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="new_footer_area bg_color">
      <div className="new_footer_top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div
                className="f_widget company_widget wow fadeInLeft"
                data-wow-delay="0.2s"
                style={{
                  visibility: "visible",
                  animationDelay: "0.2s",
                  animationName: "fadeInLeft",
                }}
              >
                <h3 className="f-title f_600 t_color f_size_18">{APP_NAME} Platform</h3>
                <p>{t("footer.desc")}</p>
                <form
                  action="#"
                  className="f_subscribe_two mailchimp mt-4"
                  method="post"
                  noValidate
                >
                  <input
                    type="text"
                    name="EMAIL"
                    className="form-control memail w-full px-4 py-2 border border-border rounded-md mb-3 bg-bg-surface text-text-primary focus:outline-none focus:border-accent"
                    placeholder={t("footer.email") || "Email Address"}
                    suppressHydrationWarning
                  />
                  <button className="btn btn_get btn_get_two w-full px-4 py-2 rounded-md transition-colors font-medium" type="submit" suppressHydrationWarning>
                    {t("footer.newsletter") || "Join Newsletter"}
                  </button>
                </form>
              </div>
            </div>
            <div>
              <div
                className="f_widget about-widget lg:pl-10 wow fadeInLeft"
                data-wow-delay="0.4s"
                style={{
                  visibility: "visible",
                  animationDelay: "0.4s",
                  animationName: "fadeInLeft",
                }}
              >
                <h3 className="f-title f_600 t_color f_size_18">{t("footer.quick")}</h3>
                <ul className="list-unstyled f_list">
                  <li><Link href="/submit">{t("footer.report") || "Report an Issue"}</Link></li>
                  <li><Link href="/track">{t("footer.trackComplaint") || "Track Complaint"}</Link></li>
                  <li><Link href="/dashboard">{t("footer.dashboard") || "Public Dashboard"}</Link></li>
                  <li><Link href="#">{t("footer.guidelines") || "Community Guidelines"}</Link></li>
                  <li><Link href="#">{t("footer.stories") || "Success Stories"}</Link></li>
                </ul>
              </div>
            </div>
            <div>
              <div
                className="f_widget about-widget lg:pl-10 wow fadeInLeft"
                data-wow-delay="0.6s"
                style={{
                  visibility: "visible",
                  animationDelay: "0.6s",
                  animationName: "fadeInLeft",
                }}
              >
                <h3 className="f-title f_600 t_color f_size_18">{t("footer.legal")}</h3>
                <ul className="list-unstyled f_list">
                  <li><a href="#">{t("footer.faq") || "FAQ"}</a></li>
                  <li><a href="#">{t("footer.privacy")}</a></li>
                  <li><a href="#">{t("footer.terms")}</a></li>
                  <li><a href="#">{t("footer.directory") || "Authority Directory"}</a></li>
                  <li><a href="#">{t("footer.support") || "Support Center"}</a></li>
                </ul>
              </div>
            </div>
            <div>
              <div
                className="f_widget social-widget lg:pl-10 wow fadeInLeft"
                data-wow-delay="0.8s"
                style={{
                  visibility: "visible",
                  animationDelay: "0.8s",
                  animationName: "fadeInLeft",
                }}
              >
                <h3 className="f-title f_600 t_color f_size_18">{t("footer.connect") || "Connect With Us"}</h3>
                <div className="mt-6 flex justify-start">
                  <SocialCard />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_bg">
          <div className="footer_bg_one"></div>
          <div className="footer_bg_two"></div>
        </div>
      </div>
      <div className="footer_bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="mb-0 f_400 text-text-secondary">© {new Date().getFullYear()} {APP_NAME}. {t("footer.rights") || "All rights reserved."}</p>
            </div>
            <div className="text-center sm:text-right text-text-secondary flex items-center gap-1">
              {t("footer.made") || "Made with"} <Heart size={14} className="text-rose-500 fill-rose-500 mx-1" /> {t("footer.country") || "for India"}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
