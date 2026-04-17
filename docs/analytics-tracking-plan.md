# Analytics Tracking Plan

This repo now includes a first-party analytics event layer that is compatible with `window.dataLayer` and optional GA4 `gtag`.

## What Becomes Retrievable

### Automatic
- `page_view`
  - `path`
  - `pathname`
  - `search`
  - `title`
  - `referrer`

### Projects Discovery
- `projects_listing_viewed`
  - `query`
  - `project_type`
  - `completion_stage`
  - `location`
  - `selected_project_slug`
  - `view_mode`
  - `result_count`
  - `map_result_count`
  - `has_filters`

### Wishlist
- `wishlist_project_added`
- `wishlist_project_removed`
- `wishlist_property_added`
- `wishlist_property_removed`
- `wishlist_shared`
- `wishlist_tab_changed`
- `wishlist_property_map_focus`
- `wishlist_project_map_focus`

Key fields across wishlist events:
- `project_id`
- `project_slug`
- `project_title`
- `property_id`
- `property_slug`
- `property_title`
- `developer_name`
- `location`
- `offer_type`
- `price_label`
- `wishlist_count`
- `tab`

### Compare
- `compare_project_added`
- `compare_project_removed`
- `compare_property_added`
- `compare_property_removed`
- `compare_projects_cleared`
- `compare_properties_cleared`
- `compare_modal_opened`
- `compare_tab_changed`

Key fields across compare events:
- `project_id`
- `project_slug`
- `project_title`
- `property_id`
- `property_slug`
- `property_title`
- `compare_count`
- `tab`
- `context`

### Map
- `map_marker_selected`

Key fields:
- `context`
- `item_id`
- `item_title`
- `item_subtitle`
- `item_href`

### Inquiry Funnel
- `inquiry_started`
- `inquiry_submitted`
- `inquiry_submission_failed`

Key fields:
- `project_id`
- `property_option_count`
- `selected_property_label`
- `status`
- `message`

## Vendor Setup

### Supported immediately
- Google Tag Manager or any tool reading `window.dataLayer`
- Google Analytics 4 via optional `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Optional env var
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

If the GA measurement ID is not set, events still go into `window.dataLayer` and `window.__immoNeufAnalyticsLog`.

## Current Limit

This implementation does not yet write analytics into Supabase tables. If you want long-term warehouse-style reporting inside your own database, add an events table later and mirror the tracked events there.
