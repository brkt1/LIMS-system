from django.urls import path
from .test_pricing_views import TestPricingListCreateView, TestPricingRetrieveUpdateDestroyView, TestPricingDiscountListCreateView
from .test_categories_views import TestCategoryViewSet

urlpatterns = [
    path("api/test-pricing/", TestPricingListCreateView.as_view(), name="test-pricing-list"),
    path("api/test-pricing/<str:id>/", TestPricingRetrieveUpdateDestroyView.as_view(), name="test-pricing-detail"),
    path("api/test-pricing-discounts/", TestPricingDiscountListCreateView.as_view(), name="test-pricing-discounts"),
    path("api/test-categories/", TestCategoryViewSet.as_view({'get': 'list_categories'}), name="test-categories"),
    path("api/test-categories/stats/", TestCategoryViewSet.as_view({'get': 'category_stats'}), name="test-category-stats"),
]